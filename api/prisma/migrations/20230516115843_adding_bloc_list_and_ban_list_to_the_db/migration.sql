-- CreateTable
CREATE TABLE "_BlockList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channel_bans" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockList_AB_unique" ON "_BlockList"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockList_B_index" ON "_BlockList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channel_bans_AB_unique" ON "_channel_bans"("A", "B");

-- CreateIndex
CREATE INDEX "_channel_bans_B_index" ON "_channel_bans"("B");

-- AddForeignKey
ALTER TABLE "_BlockList" ADD CONSTRAINT "_BlockList_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockList" ADD CONSTRAINT "_BlockList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channel_bans" ADD CONSTRAINT "_channel_bans_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channel_bans" ADD CONSTRAINT "_channel_bans_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
