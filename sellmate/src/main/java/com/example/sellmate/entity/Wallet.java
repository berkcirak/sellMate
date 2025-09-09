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
