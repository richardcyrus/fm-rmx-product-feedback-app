import { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";

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
 * @param {number} id - The id of the product request to find.
 */
async function getProductRequestById(id: number) {
  const whereCriteria = Prisma.validator<Prisma.ProductRequestWhereInput>()({
    id,
  });

  const productRequest = await db.productRequest.findUnique({
    where: whereCriteria,
  });

  if (!productRequest) {
    throw json(`ProductRequest with id=${id} was not found.`, { status: 404 });
  }

  return productRequest;
}

/**
 * Get a ProductRequest record and associated comments by the product request id.
 *
 * @param {number} id - The id of the product request to find.
 */
async function getProductRequestWithCommentsById(id: number) {
  const productRequestWhere =
    Prisma.validator<Prisma.ProductRequestWhereInput>()({
      id,
    });

  const withCommentReplyUser = Prisma.validator<Prisma.CommentInclude>()({
    user: true,
  });

  const withNestedCommentReplies = Prisma.validator<Prisma.CommentInclude>()({
    user: true,
    replies: { include: withCommentReplyUser },
  });

  /**
   *  Limitation with Prisma, recursive queries not supported.
   *  This query fragment will only return two levels of replies for the comments.
   *  The count of comments, however, will be the correct total.
   */
  const productRequestInclude =
    Prisma.validator<Prisma.ProductRequestInclude>()({
      comments: {
        where: { isReply: false },
        include: {
          user: true,
          replies: {
            include: withNestedCommentReplies,
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    });

  const productRequest = await db.productRequest.findUnique({
    where: productRequestWhere,
    include: productRequestInclude,
  });

  if (!productRequest) {
    throw json(`ProductRequest with id=${id} was not found`, {
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
  const whereCriteria = Prisma.validator<Prisma.ProductRequestWhereInput>()({
    status: { not: "suggestion" },
  });

  const countAggregate =
    Prisma.validator<Prisma.ProductRequestCountAggregateInputType>()({
      status: true,
    });

  const roadmapSummary = await db.productRequest.groupBy({
    by: ["status"],
    where: whereCriteria,
    _count: countAggregate,
  });

  if (!roadmapSummary) {
    throw json("Roadmap summary information not found!", { status: 404 });
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

  const includeCommentCount = Prisma.validator<Prisma.ProductRequestInclude>()({
    _count: {
      select: { comments: true },
    },
  });

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
      category: { equals: category },
    };
  } else {
    filter = { status: { equals: "suggestion" } };
  }

  return db.productRequest.findMany({
    where: filter,
    orderBy: sortCriteria,
    include: includeCommentCount,
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
  const productRequest = Prisma.validator<Prisma.ProductRequestCreateInput>()({
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

  return db.productRequest.update({
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
  return db.productRequest.delete({
    where: { id },
  });
}

/**
 * Get the ProductRequest entries for a particular status.
 *
 * @param {string} filter - The status to filter by.
 */
async function getRoadmapData(filter: string) {
  const productRequest = Prisma.validator<Prisma.ProductRequestFindManyArgs>()({
    where: { status: filter },
    orderBy: { upvotes: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  return db.productRequest.findMany(productRequest);
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
