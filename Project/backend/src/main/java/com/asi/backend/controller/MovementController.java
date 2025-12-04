package com.asi.backend.controller;

import com.asi.backend.model.Alert;
import com.asi.backend.model.Movement;
import com.asi.backend.model.Product;
import com.asi.backend.repository.AlertRepository;
import com.asi.backend.repository.MovementRepository;
import com.asi.backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(MovementController.class);

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AlertRepository alertRepository;

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

        // Recalcular y guardar estados de alertas relacionadas con este producto
        List<Alert> activatedAlerts = null;
        try {
            List<Alert> alerts = alertRepository.findByProductId(product.getId());
            java.util.ArrayList<Alert> newlyActivated = new java.util.ArrayList<>();
            for (Alert alert : alerts) {
                String prevStatus = alert.getStatus();
                String newStatus = (product.getStockQuantity() < alert.getThreshold()) ? "Stock Bajo" : "Correcto";
                alert.setStatus(newStatus);
                if (!"Stock Bajo".equals(prevStatus) && "Stock Bajo".equals(newStatus)) {
                    newlyActivated.add(alert);
                }
            }
            alertRepository.saveAll(alerts);
            activatedAlerts = newlyActivated;
        } catch (Exception ex) {
            logger.error("Error actualizando alertas para producto {}: {}", product.getId(), ex.getMessage(), ex);
        }

        Movement movement = new Movement();
        movement.setProduct(product);
        movement.setQuantity(qty);
        movement.setType(type.equals("IN")?"IN":"OUT");
        movement.setReason(request.reason);
        movement.setResponsibleUser(request.responsibleUser);
        movement.setDate(LocalDateTime.now());

        movementRepository.save(movement);

        // Devolver movimiento y las alertas que pasaron a 'Stock Bajo' (si las hay)
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("movement", movement);
        resp.put("activatedAlerts", activatedAlerts != null ? activatedAlerts : java.util.Collections.emptyList());
        return ResponseEntity.ok(resp);
    }

    public static class MovementRequest {
        public Long productId;
        public Integer quantity;
        public String type;
        public String reason;
        public String responsibleUser;
    }
}
