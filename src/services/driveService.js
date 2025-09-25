export const listFiles = async (accessToken) => {
  const response = await fetch(
    "https://www.googleapis.com/drive/v3/files?fields=files(id,name,modifiedTime)",
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  const data = await response.json();
  return data.files || [];
};

export const uploadFile = async (accessToken, file) => {
  const metadata = {
    name: file.name,
    mimeType: file.type
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: form,
    }
  );
  return response.json();
};

export const downloadFile = async (accessToken, fileId) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` })
    }
  );
  return response.blob();
};

export const deleteFile = async (accessToken, fileId) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  return response.ok;
};