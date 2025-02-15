class DbService {
  static async createItem(item, model) {
    const result = new model(item);
    await result.save();

    return result;
  }

  static async updateItem(id, item, model) {
    const result = await model.findByIdAndUpdate(id, item, { new: true });
    return result;
  }

  static async deleteItem(id, model) {
    const result = await model.findByIdAndDelete(id);
    return result;
  }

  static async getItem(id, model) {
    const result = await model.findById(id).exec();

    return result;
  }

  static async getItems(model, query) {
    const result = await model.find(query);
    return result;
  }
}

export default DbService;
