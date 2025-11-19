package com.asi.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "supplier_reference")
    private String supplierReference;

    @Column(nullable = false)
    private Integer stockQuantity;

    private String warehouseLocation;

    private String supplierName; 
    private Integer numberOfBoxes;
    private Integer piecesPerBox;
    private Integer minStockThreshold;
}