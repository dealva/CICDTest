
//setting user permission
export function canUseAction(role, action, scope = 'any') {
    const permissions = {
      student: ['view:own', 'update:own'],
      lecturer: ['view:own', 'update:own', 'view:related', 'update:related', 'delete:related'],
      admin: ['view:any', 'add:any', 'update:any', 'delete:any'],
    };
  
    return permissions[role]?.includes(`${action}:${scope}`);
  }
  