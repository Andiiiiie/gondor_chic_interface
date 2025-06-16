import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

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
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  featuredProduct: Product | null = null;
  isConnected = false;

  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // this.selectFeaturedProduct();
      }
    })
    this.productService.getDailyProduct().subscribe({
      next: (data) =>{
        this.featuredProduct = data.data
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

  // onSubmit() {
  //   console.log('Tentative de connexion avec:', this.username);
  //   // Ici vous pourrez appeler votre API d'authentification
  // }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { pseudo, password } = this.loginForm.value;
      this.authService.login(pseudo, password).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/home-connected']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erreur de connexion';
        },
      });
    }
  }
}