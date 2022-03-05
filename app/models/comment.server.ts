import { Prisma } from "@prisma/client";

import { db } from "~/utils/db.server";

/**
 * For this project, the `current user` is hard-coded to a specific value.
 */
function getCurrentUser() {
  let user: Prisma.UserCreateNestedOneWithoutCommentsInput = {
    connect: { username: "velvetround" },
  };

  return user;
}

/**
 * Create a new Comment record.
 *
 * @param content - The comment content.
 * @param productRequestId - The id of the associated product request.
 */
async function createComment(content: string, productRequestId: number) {
  let user = getCurrentUser();

  let productRequest: Prisma.ProductRequestCreateNestedOneWithoutCommentsInput =
    {
      connect: { id: productRequestId },
    };

  let comment = Prisma.validator<Prisma.CommentCreateInput>()({
    content: content,
    user: { ...user },
    productRequest: { ...productRequest },
  });

  return db.comment.create({ data: comment });
}

/**
 * Create a new Comment reply.
 *
 * @param content - The comment content.
 * @param productRequestId - The id of the associated product request.
 * @param replyingToUsername - The username of the comment for this reply.
 * @param parentId - The id of the parent comment for this reply.
 */
async function createCommentReply(
  content: string,
  productRequestId: number,
  replyingToUsername: string,
  parentId: number
) {
  let user = getCurrentUser();

  let productRequest: Prisma.ProductRequestCreateNestedOneWithoutCommentsInput =
    {
      connect: { id: productRequestId },
    };

  let comment = Prisma.validator<Prisma.CommentCreateInput>()({
    content: content,
    isReply: true,
    replyingTo: replyingToUsername,
    productRequest: { ...productRequest },
    user: { ...user },
    reply: { connect: { id: parentId } },
  });

  return db.comment.create({ data: comment });
}

export { createComment, createCommentReply };
