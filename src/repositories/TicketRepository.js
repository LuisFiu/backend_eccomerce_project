export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(amount, purchaser) {
    return this.dao.create(amount, purchaser);
  }
}
