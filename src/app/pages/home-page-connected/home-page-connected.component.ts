import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Product {
  id: number;
  product_name: string;
  description: string;
  current_price: number;
  stock: number;
  image_url: string;
}

@Component({
  selector: 'app-home-page-connected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page-connected.component.html',
  styleUrl: './home-page-connected.component.scss'
})
export class HomePageConnectedComponent {
  user: any = null;
  products: Product[] = [];
  featuredProduct: Product | null = null;


  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.http
        .get('http://localhost:5000/api/users/me', {
          headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        })
        .subscribe({
          next: (response: any) => {
            this.user = response.data;
          },
          error: (err) => {
            console.error('Erreur:', err);
          },
        });
    }
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
}
