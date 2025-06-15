import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';

interface Product {
  id: number;
  product_name: string;
  description: string;
  current_price: number;
  stock: number;
  image_url: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit{
  username: string = '';
  password: string = '';
  featuredProduct: Product | null = null;
  isConnected = true;

  products: Product[] = [];

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.selectFeaturedProduct();
      }
    })
  }

  selectFeaturedProduct() {
    // Trouver le produit avec le prix le plus proche de la moyenne
    const current_prices = this.products.map(p => p.current_price);
    const average = current_prices.reduce((a, b) => a + b, 0) / current_prices.length;

    this.featuredProduct = this.products.reduce((prev, curr) =>
      Math.abs(curr.current_price - average) < Math.abs(prev.current_price - average) ? curr : prev
    );
  }

  onSubmit() {
    console.log('Tentative de connexion avec:', this.username);
    // Ici vous pourrez appeler votre API d'authentification
  }
}