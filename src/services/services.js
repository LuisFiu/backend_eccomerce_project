import UserRepository from "../repositories/UserRepository.js";
import usersDAO from "../db/mongo/usersDAO.js";
export const UserService = new UserRepository(new usersDAO());

import ProductRepository from "../repositories/ProductRepository.js";
import productDAO from "../db/mongo/productDAO.js";
export const ProductService = new ProductRepository(new productDAO());

import CartRepository from "../repositories/CartRepository.js";
import cartDAO from "../db/mongo/cartDAO.js";
export const CartService = new CartRepository(new cartDAO());

import TicketRepository from "../repositories/ticketRepository.js";
import ticketDAO from "../db/mongo/ticketDAO.js";
export const TicketService = new TicketRepository(new ticketDAO());
