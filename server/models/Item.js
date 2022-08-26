class Item {
  constructor(props) {
    this.id = props.id;
    this.creator_id = props.creator_id;
    this.name = props.name;
    this.cost = props.cost;
    this.link = props.link || null;

    if (!this.creator_id || !this.name || !this.cost) {
      const e = new Error("Missing required fields");
      e.code = 403;
      throw e;
    }
  }

  getItem() {
    return {
      id: this.id,
      creator_id: this.creator_id,
      name: this.name,
      cost: this.cost,
      link: this.link,
    };
  }

  getItemAsArray() {
    return [this.id, this.creator_id, this.name, this.cost, this.link].filter(
      (prop) => prop !== undefined
    );
  }
}

export default Item;
