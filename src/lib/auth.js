//check if user not found
export function handleUserNotFound(user) {
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return null;
}

export function handleForbidden() {
    return Response.json({ error: "Forbidden" }, { status: 403 });
}
//check RBAC Scope
export function getRBACScope(session, targetUser) {
    const isOwner = session.userId === targetUser.id;
    const isRelated = session.role === 'lecturer' && session.major === targetUser.major;

    if (isOwner) return 'own';
    if (isRelated) return 'related';
    return 'any';
}
