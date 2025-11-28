package com.asi.backend.controller;

import com.asi.backend.model.Movement;
import com.asi.backend.model.Product;
import com.asi.backend.repository.MovementRepository;
import com.asi.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "http://localhost:5173")
public class MovementController {

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Movement> getAllMovements() {
        return movementRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> registerMovement(@RequestBody MovementRequest request) {
        Optional<Product> pOpt = productRepository.findById(request.productId);
        if (!pOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Producto no encontrado");
        }

        Product product = pOpt.get();
        int qty = request.quantity != null ? request.quantity : 0;

        String type = request.type != null ? request.type.toUpperCase() : "IN";

        if ("OUT".equals(type) || "SALIDA".equalsIgnoreCase(type)) {
            if (product.getStockQuantity() < qty) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Stock insuficiente para la salida");
            }
            product.setStockQuantity(product.getStockQuantity() - qty);
        } else {
            product.setStockQuantity(product.getStockQuantity() + qty);
        }

        productRepository.save(product);

        Movement movement = new Movement();
        movement.setProduct(product);
        movement.setQuantity(qty);
        movement.setType(type.equals("IN")?"IN":"OUT");
        movement.setReason(request.reason);
        movement.setResponsibleUser(request.responsibleUser);
        movement.setDate(LocalDateTime.now());

        movementRepository.save(movement);

        return ResponseEntity.ok(movement);
    }

    public static class MovementRequest {
        public Long productId;
        public Integer quantity;
        public String type;
        public String reason;
        public String responsibleUser;
    }
}
