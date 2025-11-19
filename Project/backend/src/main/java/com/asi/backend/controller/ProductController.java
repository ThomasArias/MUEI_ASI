package com.asi.backend.controller;

import com.asi.backend.model.Product;     
import com.asi.backend.repository.ProductRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setSupplierReference(productDetails.getSupplierReference());
            product.setStockQuantity(productDetails.getStockQuantity());
            product.setWarehouseLocation(productDetails.getWarehouseLocation());
            product.setSupplierName(productDetails.getSupplierName());
            product.setNumberOfBoxes(productDetails.getNumberOfBoxes());
            product.setPiecesPerBox(productDetails.getPiecesPerBox());
            product.setMinStockThreshold(productDetails.getMinStockThreshold());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            productRepository.delete(product);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/init")
    public String initData() {
        if(productRepository.count() == 0) {
             productRepository.save(new Product(null, "Mezcla de Semillas Premium", "SUP-001", 1200, "Pasillo 1", "Granjas del Valle Verde", 120, 10, 100));
             productRepository.save(new Product(null, "Fertilizante Multiuso", "AGR-99", 850, "Pasillo 2", "Suministros Agro Inc.", 85, 10, 50));
             productRepository.save(new Product(null, "Tuberías de Riego", "RIE-003", 300, "Pasillo 3", "Suministros Agro Inc.", 30, 1, 20));
        }
        return "Datos cargados";
    }
}