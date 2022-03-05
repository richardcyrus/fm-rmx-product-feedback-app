import { Prisma } from "@prisma/client";

import { db } from "~/utils/db.server";

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
 * @param id - The id of the product request to find.
 */
async function getProductRequestById(id: number) {
  const productRequest = await db.productRequest.findUnique({
    where: { id },
  });

  if (!productRequest) {
    throw new Error(`ProductRequest with id=${id} was not found.`);
  }

  return productRequest;
}

/**
 * Get a ProductRequest record and associated comments by the product request id.
 *
 * @param productRequestId - The id of the product request to find.
 */
async function getProductRequestWithCommentsById(productRequestId: number) {
  /**
   *  Limitation with Prisma, recursive queries not supported.
   *  The below query will only return two levels of replies for the comments.
   *  The count of comments, however, will be the correct total.
   */
  const productRequest = await db.productRequest.findUnique({
    where: { id: productRequestId },
    include: {
      comments: {
        where: { isReply: false },
        include: {
          user: true,
          replies: {
            include: {
              user: true,
              replies: { include: { user: true } },
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
    throw new Error(`ProductRequest ${productRequestId} was not found`);
  }

  return {
    comments: productRequest.comments,
    suggestion: {
      id: productRequest.id,
      title: productRequest.title,
      category: productRequest.category,
      upvotes: productRequest.upvotes,
      status: productRequest.status,
      description: productRequest.description,
      comments: productRequest._count.comments,
    },
  };
}

/**
 * Get the count of entries for ProductRequests, not including those with a
 * status of `suggestion`.
 */
async function getRoadmapSummary() {
  const roadmapSummary = await db.productRequest.groupBy({
    by: ["status"],
    where: {
      status: {
        not: "suggestion",
      },
    },
    _count: {
      status: true,
    },
  });

  return roadmapSummary.map((entry) => ({
    status: entry.status,
    count: entry._count.status,
  }));
}

/**
 * Get ProductRequest records that are of a particular Category and a specific
 * sort order.
 *
 * @param category - The category to filter by.
 * @param sortBy - The sort criteria.
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

  const productRequests = await db.productRequest.findMany({
    where: filter,
    orderBy: sortCriteria,
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  return productRequests.map((productRequest) => ({
    comments: productRequest._count.comments,
    ...productRequest,
  }));
}

/**
 * Create a new ProductRequest record.
 *
 * @param title - The title of the product request.
 * @param category - The category for the product request
 * @param description - The description of the product request.
 */
async function createProductRequest(
  title: string,
  category: string,
  description: string
) {
  let productRequest = Prisma.validator<Prisma.ProductRequestCreateInput>()({
    title: title,
    category: category,
    upvotes: 0,
    status: "suggestion",
    description: description,
  });

  return db.productRequest.create({ data: productRequest });
}

/**
 * Update a ProductRequest record.
 *
 * @param id - The id of the ProductRequest record to update.
 * @param title - The title of the product request.
 * @param category - the category of the product request.
 * @param status - the status of the product request.
 * @param description - the descriptions of the product request.
 */
async function updateProductRequest(
  id: number,
  title: string,
  category: CategoryOptions,
  status: StatusOptions,
  description: string
) {
  let where: Prisma.ProductRequestWhereUniqueInput = { id };
  let data: Prisma.ProductRequestUpdateInput = {
    title,
    category,
    status,
    description,
  };

  return db.productRequest.update({
    where,
    data,
  });
}

/**
 * Deleted a ProductRequest record.
 *
 * @param id - The id of the record to delete.
 */
async function deleteProductRequest(id: number) {
  return db.productRequest.delete({
    where: { id },
  });
}

/**
 * Get the ProductRequest entries for a particular status.
 *
 * @param filter - the status to filter by.
 */
async function getRoadmapData(filter: string) {
  let productRequest = Prisma.validator<Prisma.ProductRequestFindManyArgs>()({
    where: { status: filter },
    orderBy: { upvotes: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  let productRequests = await db.productRequest.findMany(productRequest);

  return productRequests.map((productRequest) => ({
    comments: productRequest._count.comments,
    ...productRequest,
  }));
}

export {
  getProductRequestById,
  getProductRequestWithCommentsById,
  getRoadmapSummary,
  getSortedProductRequestByCategory,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  getRoadmapData,
};
