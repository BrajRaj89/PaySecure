package com.orderpay.service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.orderpay.entity.Order;
import com.orderpay.entity.OrderItem;
import com.orderpay.entity.OrderStatus;
import com.orderpay.entity.User;
import com.orderpay.payload.request.OrderItemRequest;
import com.orderpay.payload.request.OrderRequest;
import com.orderpay.repository.OrderRepository;
import com.orderpay.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public Order createOrder(String username, OrderRequest orderRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        BigDecimal totalAmount = BigDecimal.ZERO;
        Order order = new Order(user, BigDecimal.ZERO, OrderStatus.CREATED);
        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            OrderItem item = new OrderItem(
                itemRequest.getProductName(),
                itemRequest.getQuantity(),
                itemRequest.getPrice()
            );
            order.addOrderItem(item);
            BigDecimal itemTotal = itemRequest.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return orderRepository.findByUser(user);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByAdmin(User admin) {
        return orderRepository.findByUserAdmin(admin);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Order not found."));
    }
}
