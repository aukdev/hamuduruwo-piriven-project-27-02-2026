package com.piriven.mcq.subject.repository;

import com.piriven.mcq.subject.entity.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, UUID> {

    List<TeacherSubject> findByTeacherId(UUID teacherId);

    boolean existsByTeacherIdAndSubjectId(UUID teacherId, UUID subjectId);
}
