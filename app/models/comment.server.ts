import { Prisma } from "@/prisma/generated/prisma/client";

import prisma from "~/utils/db.server";

/**
 * For this project, the `current user` is hard-coded to a specific value.
 */
function getCurrentUser() {
  const user: Prisma.UserCreateNestedOneWithoutCommentsInput = {
    connect: { username: "velvetround" },
  };

  return user;
}

/**
 * Create a new Comment record.
 *
 * @param {string} content - The comment content.
 * @param {number} id - The id of the associated product request.
 */
async function createComment(content: string, id: number) {
  const user = getCurrentUser();

  const productRequest: Prisma.ProductRequestCreateNestedOneWithoutCommentsInput =
    {
      connect: { id },
    };

  return prisma.comment.create({ data: {
    content: content,
    user: { ...user },
    productRequest: { ...productRequest },
  }});
}

/**
 * Create a new Comment reply.
 *
 * @param {string} content - The comment content.
 * @param {number} id - The id of the associated product request.
 * @param {string} replyingToUsername - The username of the comment for this reply.
 * @param {number} parentId - The id of the parent comment for this reply.
 */
async function createCommentReply(
  content: string,
  id: number,
  replyingToUsername: string,
  parentId: number
) {
  const user = getCurrentUser();

  const productRequest: Prisma.ProductRequestCreateNestedOneWithoutCommentsInput =
    {
      connect: { id },
    };

  return prisma.comment.create({ data: {
    content: content,
    isReply: true,
    replyingTo: replyingToUsername,
    productRequest: { ...productRequest },
    user: { ...user },
    reply: { connect: { id: parentId } },
  } });
}

export { createComment, createCommentReply };
