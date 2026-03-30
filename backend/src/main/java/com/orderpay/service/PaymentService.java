package com.orderpay.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orderpay.entity.Order;
import com.orderpay.entity.OrderStatus;
import com.orderpay.entity.Payment;
import com.orderpay.entity.PaymentStatus;
import com.orderpay.entity.User;
import com.orderpay.repository.OrderRepository;
import com.orderpay.repository.PaymentRepository;
import com.orderpay.repository.UserRepository;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderRepository orderRepository;
    
    @Autowired
    UserRepository userRepository;

    @Transactional
    public Payment processPayment(String username, Long orderId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Error: Order not found."));

        // Validate Ownership
        if (!order.getUser().equals(user)) {
             throw new RuntimeException("Error: You are not authorized to pay for this order.");
        }

        // Validate Status
        if (order.getStatus() == OrderStatus.PAID) {
            throw new RuntimeException("Error: Order is already paid.");
        }
        
        if (paymentRepository.existsByOrder(order)) {
             throw new RuntimeException("Error: Payment already exists for this order.");
        }

        // SIMULATE PAYMENT PROCESSING DELAY
        try { Thread.sleep(1000); } catch (InterruptedException e) {}

        // SIMULATE PAYMENT FAILURE (20% chance)
        if (new java.util.Random().nextInt(100) < 20) {
             throw new RuntimeException("Error: Payment failed due to a processing error. Transaction rolled back.");
        }

        Payment payment = new Payment(order, order.getTotalAmount(), PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        // Update Order Status
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        return payment;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return paymentRepository.findByOrder_User(user);
    }

    public Payment getPaymentByOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Error: Order not found."));
        
        return paymentRepository.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Error: Payment not found for this order."));
    }
}
