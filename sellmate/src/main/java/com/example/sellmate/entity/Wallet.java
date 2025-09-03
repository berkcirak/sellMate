package com.example.sellmate.entity;

import com.example.sellmate.entity.base.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "wallets")
public class Wallet extends BaseEntity {


    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    private BigDecimal balance = BigDecimal.ZERO;
    private String currency= "TRY";



}
