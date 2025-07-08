package com.example.ecommerce.OrderRepo;

import com.example.ecommerce.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepo extends JpaRepository<Order, Long> {
}
