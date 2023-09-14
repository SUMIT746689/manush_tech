import { PrismaClient } from '@prisma/client'

let prisma = new PrismaClient()

  const psm = async () => {
    prisma.$on('beforeExit', async () => {
      console.log('beforeExit hook')
    })
  }
  psm();

export default prisma