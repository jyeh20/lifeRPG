class Item {
  constructor(props) {
    this.id = props.id;
    this.creator_id = props.creator_id;
    this.name = props.name;
    this.cost = props.cost;
    this.item_url = props.item_url || null;

    if (!this.creator_id || !this.name || !this.cost) {
      const e = new Error("Missing required fields");
      e.code = 403;
      throw e;
    }
  }

  getItem() {
    return {
      id: this.id,
      name: this.name,
      cost: this.cost,
      link: this.item_url,
      creator_id: this.creator_id,
    };
  }

  getItemAsArray() {
    return [
      this.id,
      this.name,
      this.cost,
      this.item_url,
      this.creator_id,
    ].filter((prop) => prop !== undefined);
  }
}

export default Item;
