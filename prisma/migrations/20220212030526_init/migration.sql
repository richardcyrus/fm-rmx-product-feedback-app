-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(250) NOT NULL,
    "isReply" BOOLEAN DEFAULT false,
    "replyingTo" TEXT,
    "parentId" INTEGER,
    "userId" INTEGER NOT NULL,
    "productRequestId" INTEGER,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_requests" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "product_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "comments_productRequestId_idx" ON "comments"("productRequestId");

-- CreateIndex
CREATE INDEX "product_requests_upvotes_idx" ON "product_requests"("upvotes");

-- CreateIndex
CREATE INDEX "product_requests_category_idx" ON "product_requests"("category");

-- CreateIndex
CREATE INDEX "product_requests_status_idx" ON "product_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_productRequestId_fkey" FOREIGN KEY ("productRequestId") REFERENCES "product_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
