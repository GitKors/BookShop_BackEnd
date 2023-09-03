const TYPES = {
  BookController: Symbol.for('BookController'),
  BookService: Symbol.for('BookService'),
  BookRepository: Symbol.for('BookRepository'),
  AuthService: Symbol.for('AuthService'), 
  App: Symbol.for('App'),
  PrismaClient: Symbol.for('PrismaClient'), 
  DatabaseService: Symbol.for('DatabaseService'),
  AuthController: Symbol('AuthController'),
  RatingsController: Symbol('RatingsController'),
  CategoryController: Symbol('CategoryController'),
  CategoryRepository: Symbol('CategoryRepository'),
};

export default TYPES;
