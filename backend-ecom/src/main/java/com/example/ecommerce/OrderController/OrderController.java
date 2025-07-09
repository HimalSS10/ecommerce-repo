package com.example.ecommerce.OrderController;

import com.example.ecommerce.Model.Order;
import com.example.ecommerce.OrderRepo.OrderRepo;
import com.example.ecommerce.OrderService.orderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Value("${payment.url}")
    private String paymentBaseUrl;

    @Autowired
    private OrderRepo repo;

    @Autowired
    private orderService orderService;

    @GetMapping
    public List<Order> getOrders() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Order> getOrderId(@PathVariable Long id) {
        return repo.findById(id);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        System.out.println("order" + order.getProduct());
        Order savedOrder = orderService.createOrder(order);

        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("order_id", savedOrder.getId());
        paymentData.put("user_id", 1);
        paymentData.put("price", savedOrder.getPrice());

        try {
            // Convert paymentData to JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String requestBody = objectMapper.writeValueAsString(paymentData);

            // Build the HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(paymentBaseUrl + "/payment/add"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            // Send the request
            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Payment service response: " + response.body());
        } catch (Exception e) {
            System.err.println("Failed to call payment service: " + e.getMessage());
        }
        return savedOrder;
    }
}
