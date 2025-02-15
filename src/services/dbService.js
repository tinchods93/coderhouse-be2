class DbService {
  static async createItem(item, model) {
    const newItem = new model(item);
    await newItem.save();

    return newItem;
  }

  static async updateItem(id, item, model) {
    const updatedItem = await model.findByIdAndUpdate(id, item, { new: true });
    return updatedItem;
  }

  static async deleteItem(id, model) {
    const deletedItem = await model.findByIdAndDelete(id);
    return deletedItem;
  }

  static async getItem(id, model) {
    const item = await model.findById(id).exec();

    return item;
  }

  static async getItems(model, query) {
    const items = await model.find(query);
    return items;
  }
}

export default DbService;
