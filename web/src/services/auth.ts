import api from "./api";

export async function getUserData(accessToken: string) {
  const response = await api.get("usuarios/me/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
