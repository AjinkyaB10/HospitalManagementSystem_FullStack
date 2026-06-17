package com.hospital.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.model.Role;
import com.hospital.model.User;
import com.hospital.service.AppointmentService;
import com.hospital.service.DoctorService;
import com.hospital.service.PatientService;
import com.hospital.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", doctorService.getAllDoctors().size());
        stats.put("totalPatients", patientService.getAllPatients().size());
        stats.put("totalAppointments", appointmentService.getAllAppointments().size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PostMapping("/doctors/add")
    public ResponseEntity<?> addDoctor(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        if (userService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        User user = new User();
        user.setName((String) request.get("name"));
        user.setEmail(email);
        user.setPassword((String) request.get("password"));
        user.setRole(Role.DOCTOR);
        User savedUser = userService.saveUser(user);

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setSpecialization((String) request.get("specialization"));
        doctor.setExperience((String) request.get("experience"));
        doctor.setAvailableDays((String) request.get("availableDays"));
        doctor.setAvailableTime((String) request.get("availableTime"));
        doctor.setFees(Double.parseDouble(request.get("fees").toString()));

        doctorService.saveDoctor(doctor);

        return ResponseEntity.ok("Doctor added successfully!");
    }

    @DeleteMapping("/doctors/delete/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted successfully!");
    }
    
    
    @PutMapping("/doctors/update/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor updatedDoctor) {
        Doctor existing = doctorService.getDoctorById(id).orElseThrow();
        existing.setSpecialization(updatedDoctor.getSpecialization());
        existing.setExperience(updatedDoctor.getExperience());
        existing.setFees(updatedDoctor.getFees());
        existing.setAvailableDays(updatedDoctor.getAvailableDays());
        existing.setAvailableTime(updatedDoctor.getAvailableTime());
        doctorService.saveDoctor(existing);
        return ResponseEntity.ok("Doctor updated successfully!");
    }
    
    @PutMapping("/patients/update/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Patient existing = patientService.getPatientById(id).orElseThrow();
        
        if (request.get("phone") != null)
            existing.setPhone(request.get("phone").toString());
        if (request.get("age") != null)
            existing.setAge(Integer.parseInt(request.get("age").toString()));
        if (request.get("bloodGroup") != null)
            existing.setBloodGroup(request.get("bloodGroup").toString());
        if (request.get("address") != null)
            existing.setAddress(request.get("address").toString());

        patientService.savePatient(existing);
        return ResponseEntity.ok("Patient updated successfully!");
    }
    
    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}