package com.hospital.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String specialization;
   
    private String experience;
    private String availableDays;
    private String availableTime;
    private Double fees;
    private String phone; 

}
