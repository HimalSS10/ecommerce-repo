package com.example.ecommerce.OrderController;

import com.example.ecommerce.DTO.OrderDto;
import com.example.ecommerce.Model.Order;
import com.example.ecommerce.OrderRepo.OrderRepo;
import com.example.ecommerce.OrderService.orderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
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
        return orderService.createOrder(order);
    }
}
