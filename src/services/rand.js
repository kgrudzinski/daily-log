const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const RandService = {
  generateId: (size) => {
    const id_size = size || 12;
    let id = "";
    for (let i = 0; i < id_size; ++i) {
      const c = Math.floor(Math.random() * 36);
      id += chars[c];
    }
    return id;
  },
};
