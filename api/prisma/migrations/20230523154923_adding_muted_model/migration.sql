-- CreateTable
CREATE TABLE "Muted" (
    "id" SERIAL NOT NULL,
    "muteExpiration" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER,

    CONSTRAINT "Muted_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Muted" ADD CONSTRAINT "Muted_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
