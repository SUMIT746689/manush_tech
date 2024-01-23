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

export const verifyIsMasking = (sender_id: string): boolean => {
  if (!sender_id) return;

  // if (!(sender_id?.length === 11 || sender_id?.length === 13)) return 'non_masking';

  for (const element of sender_id) {
    const parseNumeric = parseInt(element);
    if (isNaN(parseNumeric)) return true;
  };

  if (sender_id.length === 11 && sender_id.slice(0, 1) === '0') return false;
  else if (sender_id.length === 13 && sender_id.slice(0, 3) === '880') return false;

  return true;
}