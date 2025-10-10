package com.example.sellmate.entity;

import com.example.sellmate.entity.base.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "wallets")
public class Wallet extends BaseEntity {


    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;
    @Column(nullable = false, length = 3)
    private String currency= "TRY";
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal reservedBalance = BigDecimal.ZERO;

    public BigDecimal available(){
        return balance.subtract(reservedBalance);
    }
    public void reserve(BigDecimal amount){
        if (amount == null || amount.signum() <= 0){
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (available().compareTo(amount) < 0){
            throw new IllegalArgumentException("Insufficient balance");
        }
        reservedBalance = reservedBalance.add(amount);
    }
    public void release(BigDecimal amount){
        if (amount == null || amount.signum() <= 0){
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (reservedBalance.compareTo(amount) < 0){
            throw new IllegalArgumentException("Insufficient balance");
        }
        reservedBalance = reservedBalance.subtract(amount);
    }
    public void capture(BigDecimal amount){
        if (amount == null || amount.signum() <= 0){
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (reservedBalance.compareTo(amount) < 0){
            throw new IllegalArgumentException("Insufficient balance");
        }
        reservedBalance = reservedBalance.subtract(amount);
        balance = balance.subtract(amount);
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
    public void deposit(BigDecimal amount){
        this.balance = balance.add(amount);
    }
    public void withdraw(BigDecimal amount){
        this.balance = balance.subtract(amount);
    }
}
