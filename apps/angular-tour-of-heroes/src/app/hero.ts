export class Hero {
  id: number = null;
  name: string = null;

  constructor(obj?: Hero) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
