import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import {  Product } from '../model/product.model';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products! : Array<Product>;
  currentPage:number = 0;
  pageSize:number = 5;
  totalPages:number = 0;
  errorMessage! :string;
  searchFormGroup! : FormGroup;
  currentAction : string = "all";

  constructor(private productsService : ProductService,private fb : FormBuilder) {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null),
    })
  }

  ngOnInit(): void {
    // this.handleGetAllProducts();
    this.handleGetPageProducts();
  }
  handleGetPageProducts() {
    this.productsService.getPageProducts(this.currentPage,this.pageSize).subscribe( {
      next : (data) => {
        this.products=data.Products;
        this.totalPages=data.totalPages;
      },
      error : (err) => {
        this.errorMessage = err
      }
    }); 
  }
  handleGetAllProducts() {
    this.productsService.getAllProducts().subscribe( {
      next : (data) => {
        this.products=data
      },
      error : (err) => {
        this.errorMessage = err
      }
    });
  }

  handleDeleteProduct(p:Product) {
      let conf = confirm("Are you sure");
      if(conf == false) return;
      this.productsService.deleteProduct(p.id).subscribe({
          next : (data) => {
            // this.handleGetAllProducts();
            let index = this.products.indexOf(p);
            this.products.splice(index,1);
          }
        }
      )
  }
  handleSetPromotion(p:Product) {
    let promo = p.promotion;
    this.productsService.setPromotion(p.id).subscribe({
      next:(data) => {
        p.promotion =!promo;
      },
      error: err => {
        this.errorMessage = err;
      }
    })
  }
  handleSearchProducts(){
    this.currentAction='search';
    this.currentPage=0;
    let keyword=this.searchFormGroup.value.keyword;
    this.productsService.searchProduct(keyword,this.currentPage,this.pageSize).subscribe({
      next:(data) => {
        this.products=data.Products;
        this.totalPages=data.totalPages;
      }
    })
  }
  goToPage(i:number) {
    this.currentPage=i;
    if(this.currentAction == "all")
      this.handleGetPageProducts();
    else 
      this.handleSearchProducts();
  }
    

}
