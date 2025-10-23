'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useToast } from './use-toast';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: ImagePlaceholder;
  stock: number;
  category: string;
};

type CartContextType = {
  cart: CartItem[];
  savedItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (itemId: string) => void;
  moveToCart: (itemId: string) => void;
  removeFromSaved: (itemId: string) => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function useCartState() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const item = window.localStorage.getItem('cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const item = window.localStorage.getItem('savedCartItems');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem('savedCartItems', JSON.stringify(savedItems));
    } catch (error) {
      console.error('Failed to save saved items to localStorage:', error);
    }
  }, [savedItems]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === newItem.id);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        const newQuantity = existingItem.quantity + newItem.quantity;
        
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: Math.min(newQuantity, existingItem.stock),
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...newItem, quantity: Math.min(newItem.quantity, newItem.stock) }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.min(quantity, item.stock) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveForLater = (itemId: string) => {
    const itemToSave = cart.find((item) => item.id === itemId);
    if (itemToSave) {
      setSavedItems((prev) => {
        if (prev.find(i => i.id === itemId)) return prev; // Avoid duplicates
        return [...prev, { ...itemToSave, quantity: 1 }]; // Reset quantity to 1
      });
      removeFromCart(itemId);
      toast({ title: `${itemToSave.name} saved for later.` });
    }
  };

  const moveToCart = (itemId: string) => {
    const itemToMove = savedItems.find((item) => item.id === itemId);
    if (itemToMove) {
      addToCart(itemToMove);
      removeFromSaved(itemId, false);
      toast({ title: `${itemToMove.name} moved to cart.` });
    }
  };

  const removeFromSaved = (itemId: string, showToast = true) => {
    const itemToRemove = savedItems.find((item) => item.id === itemId);
    setSavedItems((prev) => prev.filter((item) => item.id !== itemId));
    if (showToast && itemToRemove) {
        toast({ title: `${itemToRemove.name} removed from saved items.` });
    }
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    cart,
    savedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    cartCount,
    cartTotal,
  };
}


export function CartProvider({ children }: { children: ReactNode }) {
  const cartState = useCartState();

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
