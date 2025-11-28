package com.asi.backend.controller;

import com.asi.backend.model.Alert;
import com.asi.backend.model.Product;
import com.asi.backend.repository.AlertRepository;
import com.asi.backend.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:5173")

public class AlertController {

    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createAlert(@RequestBody Alert alert) {
        Product product = productRepository.findById(alert.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("El producto asociado no existe.");
        }
        if (product.getStockQuantity() < alert.getThreshold()) {
            alert.setStatus("Stock Bajo");
        } else {
            alert.setStatus("Correcto");
        }
        return ResponseEntity.ok(alertRepository.save(alert));
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateAlertStatuses() {
        List<Alert> alerts = alertRepository.findAll();
        for (Alert alert : alerts) {
            Product product = productRepository.findById(alert.getProductId()).orElse(null);
            if (product != null) {
                if (product.getStockQuantity() < alert.getThreshold()) {
                    alert.setStatus("Stock Bajo");
                } else {
                    alert.setStatus("Correcto");
                }
                alertRepository.save(alert);
            }
        }
        return ResponseEntity.ok("Estados de alertas actualizados.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        if (alertRepository.existsById(id)) {
            alertRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}