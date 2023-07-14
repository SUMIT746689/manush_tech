
export const permissionVerify = (permissions, requiredPermission)=>{
  const ispermit = permissions.find((perm) => requiredPermission.includes(perm.value));
  if(ispermit) return true;
  return false;
} 