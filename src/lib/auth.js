
// handleUserNotFound
export function handleUserNotFound(user) {
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}

// handleForbidden
export function handleForbidden() {
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

//check RBAC Scope
export function getRBACScope(session, targetUser) {
    const isOwner = session.userId === targetUser.id;
    const isRelated = session.role === 'lecturer' && session.major === targetUser.major;

    if (isOwner) return 'own';
    if (isRelated) return 'related';
    return 'any';
}
