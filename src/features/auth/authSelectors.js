export const selectCurrentUser = (state) => state.auth.currentUser;

export const selectIsAuthenticated = (state) => Boolean(state.auth.currentUser);

export const selectUserRole = (state) => state.auth.currentUser?.role || "guest";

export const selectIsAdmin = (state) => state.auth.currentUser?.role === "admin";