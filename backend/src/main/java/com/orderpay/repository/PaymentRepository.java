package com.orderpay.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.orderpay.entity.Order;
import com.orderpay.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder(Order order);
    Boolean existsByOrder(Order order);
    java.util.List<Payment> findByOrder_User(com.orderpay.entity.User user);
}
