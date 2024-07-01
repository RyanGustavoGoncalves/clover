package com.goncalves.API.entities.folder;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String > {
}
