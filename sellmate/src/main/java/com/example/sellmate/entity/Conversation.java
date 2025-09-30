package com.example.sellmate.entity;

import com.example.sellmate.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;


@Entity
public class Conversation extends BaseEntity {

    @Column(nullable = false)
    private Long userAId;
    @Column(nullable = false)
    private Long userBId;

}
