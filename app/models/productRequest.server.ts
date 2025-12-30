import { Prisma } from "@/prisma/generated/prisma/client";
import { data } from "react-router";

import prisma from "~/utils/db.server";

export type SortByOptions =
  | "mostUpvotes"
  | "leastUpvotes"
  | "mostComments"
  | "leastComments";

export type CategoryOptions = "feature" | "ui" | "ux" | "enhancement" | "bug";

export type StatusOptions = "suggestion" | "planned" | "in-progress" | "live";

/**
 * Get a ProductRequest record by the product request id.
 *
 * @param {number} id - The id of the product request to find.
 */
async function getProductRequestById(id: number) {
  const productRequest = await prisma.productRequest.findUnique({
    where: { id },
  });

  if (!productRequest) {
    throw data(`ProductRequest with id=${id} was not found.`, { status: 404 });
  }

  return productRequest;
}

/**
 * Get a ProductRequest record and associated comments by the product request id.
 *
 * @param {number} id - The id of the product request to find.
 */
async function getProductRequestWithCommentsById(id: number) {

  /**
   *  Limitation with Prisma, recursive queries not supported.
   *  This query fragment will only return two levels of replies for the comments.
   *  The count of comments, however, will be the correct total.
   */
  const productRequest = await prisma.productRequest.findUnique({
    where: { id},
    include: {
      comments: {
        where: { isReply: false },
        include: {
          user: true,
          replies: {
            include: {
              user: true,
              replies: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!productRequest) {
    throw data(`ProductRequest with id=${id} was not found`, {
      status: 404,
    });
  }

  return productRequest;
}

/**
 * Get the count of entries for ProductRequests, not including those with a
 * status of `suggestion`.
 */
async function getRoadmapSummary() {
  const roadmapSummary = await prisma.productRequest.groupBy({
    by: ["status"],
    where: {status: { not: "suggestion" }},
    _count: {status: true},
  });

  if (!roadmapSummary) {
    throw data("Roadmap summary information not found!", { status: 404 });
  }

  return roadmapSummary;
}

/**
 * Get ProductRequest records that are of a particular Category and a specific
 * sort order.
 *
 * @param {string} category - The category to filter by.
 * @param {string} sortBy - The sort criteria.
 */
async function getSortedProductRequestByCategory(
  category: string,
  sortBy: SortByOptions
) {
  let sortCriteria: Prisma.ProductRequestOrderByWithRelationInput;
  let filter: Prisma.ProductRequestWhereInput;

  switch (sortBy) {
    case "mostUpvotes": {
      sortCriteria = { upvotes: "desc" };
      break;
    }
    case "leastUpvotes": {
      sortCriteria = { upvotes: "asc" };
      break;
    }
    case "mostComments": {
      sortCriteria = { comments: { _count: "desc" } };
      break;
    }
    case "leastComments": {
      sortCriteria = { comments: { _count: "asc" } };
      break;
    }
    default: {
      sortCriteria = { upvotes: "desc" };
    }
  }

  if (category !== "all") {
    filter = {
      status: { equals: "suggestion" },
      category: { equals: category, mode: "insensitive" },
    };
  } else {
    filter = { status: { equals: "suggestion" } };
  }

  return prisma.productRequest.findMany({
    where: filter,
    orderBy: sortCriteria,
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
}

/**
 * Create a new ProductRequest record.
 *
 * @param {string} title - The title of the product request.
 * @param {string} category - The category for the product request
 * @param {string} description - The description of the product request.
 */
async function createProductRequest(
  title: string,
  category: string,
  description: string
) {
  return prisma.productRequest.create({ data: {
    title: title,
    category: category,
    upvotes: 0,
    status: "suggestion",
    description: description,
  }});
}

/**
 * Update a ProductRequest record.
 *
 * @param {number} id - The id of the ProductRequest record to update.
 * @param {string} title - The title of the product request.
 * @param {string} category - the category of the product request.
 * @param {string} status - the status of the product request.
 * @param {string} description - the descriptions of the product request.
 */
async function updateProductRequest(
  id: number,
  title: string,
  category: CategoryOptions,
  status: StatusOptions,
  description: string
) {
  const where: Prisma.ProductRequestWhereUniqueInput = { id };
  const data: Prisma.ProductRequestUpdateInput = {
    title,
    category,
    status,
    description,
  };

  return prisma.productRequest.update({
    where,
    data,
  });
}

/**
 * Deleted a ProductRequest record.
 *
 * @param {number} id - The id of the record to delete.
 */
async function deleteProductRequest(id: number) {
  return prisma.productRequest.delete({
    where: { id },
  });
}

/**
 * Get the ProductRequest entries for a particular status.
 *
 * @param {string} filter - The status to filter by.
 */
async function getRoadmapData(filter: string) {
  return prisma.productRequest.findMany({
    where: { status: filter },
    orderBy: { upvotes: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
}

export {
  createProductRequest,
  deleteProductRequest,
  getProductRequestById,
  getProductRequestWithCommentsById,
  getRoadmapData,
  getRoadmapSummary,
  getSortedProductRequestByCategory,
  updateProductRequest
};
