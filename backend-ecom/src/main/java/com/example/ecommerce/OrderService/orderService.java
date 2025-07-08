package com.example.ecommerce.OrderService;

import com.example.ecommerce.Model.Order;
import com.example.ecommerce.OrderRepo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class orderService {

    @Autowired
    private OrderRepo orderRepo;

    public Order createOrder(Order order) {
        return orderRepo.save(order);
    }
}
