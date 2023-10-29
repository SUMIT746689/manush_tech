import prisma from "@/lib/prisma_client";

export const verifyUser = async (user_id: number, acceptRoleTitles: string[]): Promise<boolean> => {
  const findUser = await prisma.user.findFirst({ where: { id: user_id }, select: { user_role: true } })
  console.log({ findUser })
  if (acceptRoleTitles.includes(findUser.user_role.title)) return true;
  return false;
}

export const verifyNumber = (value: any): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const parseNumber = parseInt(value);
  if (!Number.isNaN(parseNumber)) return parseNumber;
  return undefined;
}