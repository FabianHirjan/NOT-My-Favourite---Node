# NoF

# Software Requirements Specification
## For <NoF>
Version 1.0 approved
Prepared by <Cojocaru Tudor (2e2), Hirjan Fabian-Andrei (2e2)>
<UAIC>

Table of Contents
=================
  * [Revision History](#revision-history)
  * [Introduction](#1-introduction)
    * 1.1 [Purpose](#11-purpose)
    * 1.2 [Document Conventions](#12-document-conventions)
    * 1.3 [Intended Audience and Reading Suggestions](#13-intended-audience-and-reading-suggestions)
    * 1.4 [Product Scope](#14-product-scope)
    * 1.5 [References](#15-references)
  * [Overall Description](#overall-description)
    * 2.1 [Product Perspective](#21-product-perspective)
    * 2.2 [Product Functions](#22-product-functions)
    * 2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
    * 2.4 [Operating Environment](#24-operating-environment)
    * 2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
    * 2.6 [User Documentation](#26-user-documentation)
    * 2.7 [Assumptions and Dependencies](#27-assumptions-and-dependencies)
  * [External Interface Requirements](#external-interface-requirements)
    * 3.1 [User Interfaces](#31-user-interfaces)
    * 3.2 [Hardware Interfaces](#32-hardware-interfaces)
    * 3.3 [Software Interfaces](#33-software-interfaces)
    * 3.4 [Communications Interfaces](#34-communications-interfaces)
  * [System Features](#system-features)
    * 4.1 [System Feature 1](#41-system-feature-1)
    * 4.2 [System Feature 2 (and so on)](#42-system-feature-2-and-so-on)
  * [Other Nonfunctional Requirements](#other-nonfunctional-requirements)
    * 5.1 [Performance Requirements](#51-performance-requirements)
    * 5.2 [Safety Requirements](#52-safety-requirements)
    * 5.3 [Security Requirements](#53-security-requirements)
    * 5.4 [Software Quality Attributes](#54-software-quality-attributes)
    * 5.5 [Business Rules](#55-business-rules)
  * [Other Requirements](#other-requirements)
* [Appendix A: Glossary](#appendix-a-glossary)
* [Appendix B: Analysis Models](#appendix-b-analysis-models)
* [Appendix C: To Be Determined List](#appendix-c-to-be-determined-list)




## Revision History
| Name | Date    | Reason For Changes  | Version   |
| ---- | ------- | ------------------- | --------- |
|      |         |                     |           |
|      |         |                     |           |
|      |         |                     |           |

## 1. Introduction
### 1.1 Purpose 
A web application that manages (classes of) objects – e.g., products sold by a specific store, apartments for rent in a certain area etc. – and abstract/digital artifacts – such as lectures given by a teacher, programming languages, electronic games made by company C, Web services made available by organization O – favorited/disliked by a person or group of people. The following will be considered: important characteristics (category, context of use, price,...), at least one (un)desirable feature, justification of opinion. The created system will generate inventories and various statistics that can be exported in open formats – minimally, CSV, DocBook and PDF. A ranking of the most disliked/desirable entities will also be created, presented in an HTML page and also available as an RSS data feed. The essential functionalities will also be exposed through a REST/GraphQL Web API.

### 1.2 Document Conventions
Describe any standards or typographical conventions that were followed when writing this SRS, such as fonts or highlighting that have special significance. For example, state whether priorities  for higher-level requirements are assumed to be inherited by detailed requirements, or whether every requirement statement is to have its own priority.
### 1.3 Intended Audience and Reading Suggestions
This document is intended for developers, project managers, testers, and documentation writers. It contains an overview of the software requirements, system features, external interface requirements, nonfunctional requirements, and other details necessary for understanding the scope and functionality of the <NoF> application.
### 1.4 Product Scope
The software is a web application designed to manage various objects and digital artifacts, allowing users to interact with and provide feedback on these items. It will generate inventories, statistics, and rankings, and expose essential functionalities through a REST/GraphQL Web API.
### 1.5 References
List any other documents or Web addresses to which this SRS refers. These may include user interface style guides, contracts, standards, system requirements specifications, use case documents, or a vision and scope document. Provide enough information so that the reader could access a copy of each reference, including title, author, version number, date, and source or location.

## Overall Description
### 2.1 Product Perspective
The software is a self-contained web application designed to function independently. It may interact with external systems or APIs to retrieve or store data.
### 2.2 Product Functions
- Manage objects and digital artifacts
- Allow users to provide feedback on items
- Generate inventories, statistics, and rankings
- Expose essential functionalities through a REST/GraphQL Web API
### 2.3 User Classes and Characteristics
User classes may include administrators, registered users, and guests. Administrators have full access to system functionalities, registered users can interact with items and provide feedback, and guests have limited access.
### 2.4 Operating Environment
The software operates within a web browser environment and requires internet connectivity. It is compatible with modern web browsers such as Chrome, Firefox, and Safari.
//tbd
### 2.5 Design and Implementation Constraints
The software must comply with web development best practices and security standards. It should be designed for scalability and maintainability.
### 2.6 User Documentation
User documentation will include user manuals, on-line help, and tutorials, accessible within the application.
### 2.7 Assumptions and Dependencies
- Users have basic knowledge of web browsing and interacting with web applications.
Dependencies:
- Availability of internet connection
- External APIs or systems for data retrieval or storage
## External Interface Requirements
### 3.1 User Interfaces
The user interface will be designed to be intuitive and user-friendly, with standard navigation elements and interactive components for managing items and providing feedback.
### 3.2 Hardware Interfaces
The software interacts with hardware components through standard web protocols, requiring only a web browser for access.
### 3.3 Software Interfaces
The software may interact with external systems or APIs for data retrieval or storage, using REST or GraphQL protocols.
### 3.4 Communications Interfaces
Communication with external systems or APIs will be handled using standard web communication protocols, ensuring data security and integrity.
## System Features
This template illustrates organizing the functional requirements for the product by system features, the major services provided by the product. You may prefer to organize this section by use case, mode of operation, user class, object class, functional hierarchy, or combinations of these, whatever makes the most logical sense for your product.
### 4.1 System Feature 1
Don’t really say “System Feature 1.” State the feature name in just a few words.
4.1.1   Description and Priority
Manage objects and digital artifacts, allowing users to add, edit, and delete items.
Priority: High
//add
4.1.2   Stimulus/Response Sequences
- User selects a category or type of item -> System retrieves relevant data -> Data displayed in inventory format
- User requests statistics for a specific time period -> System analyzes data and generates statistics -> Statistics displayed to user
- User accesses rankings page -> System ranks items based on user feedback -> Rankings displayed to user displayed
4.1.3   Functional Requirements
1. System retrieves data from the database based on user queries or predefined filters.
2. System analyzes user feedback and interactions to generate statistics, including but not limited to item popularity, user engagement, and trends over time.
3. System ranks items based on predefined criteria, such as user ratings, number of interactions, or other relevant metrics.

### 4.2 System Feature 2 (and so on)

## Other Nonfunctional Requirements
### 5.1 Performance Requirements
- The system should respond to user interactions within 2 seconds under normal load conditions.
- Data retrieval and processing should be optimized for efficient performance to minimize user wait times.
### 5.2 Safety Requirements
- User data, including personal information and feedback, should be stored securely using encryption and access controls.
- User authentication mechanisms should be implemented to prevent unauthorized access to sensitive data.
### 5.3 Security Requirements
- Users should be required to authenticate before accessing certain functionalities, such as adding or editing items.
- Different levels of access should be implemented, with administrators having full control over system functionalities.
### 5.4 Software Quality Attributes
#### 5.4.1 Usability
- The user interface should be intuitive and easy to navigate, with clear instructions and feedback for user actions.
- Accessibility features should be implemented to accommodate users with disabilities.

#### 5.4.2 Maintainability
- The codebase should be well-organized and documented to facilitate future maintenance and updates.
- Modular design principles should be followed to allow for easy extension and modification of system functionalities.

### 5.5 Business Rules
#### 5.5.1 Data Privacy
- User data should be handled in compliance with relevant privacy regulations, such as GDPR or CCPA.
- Users should have control over their data and be able to modify or delete it as needed.

## Other Requirements
### 6.1 Database Requirements
#### 6.1.1 Data Schema
- The database should have a well-defined schema to store information about items, user feedback, and system settings.
- Relationships between different data entities should be properly defined and enforced through constraints.

### 6.2 Internationalization Requirements
#### 6.2.1 Multilingual Support
- The user interface should support multiple languages to accommodate users from different linguistic backgrounds.
- Textual content should be easily translatable and customizable without requiring code changes.

### 6.3 Legal Requirements
#### 6.3.1 Compliance
- The application should comply with all relevant laws and regulations in the jurisdictions where it operates.
- Legal disclaimers and terms of service should be provided to users, outlining their rights and obligations when using the application.

## Appendix A: Glossary
### Terms
- **User**: An individual who interacts with the application, including administrators, registered users, and guests.
- **Item**: A distinct object or digital artifact managed by the application, such as a product, service, or piece of content.

### Abbreviations
- **API**: Application Programming Interface
- **CSV**: Comma-Separated Values
- **DocBook**: An XML-based document format
- **PDF**: Portable Document Format
- **REST**: Representational State Transfer
- **GraphQL**: A query language for APIs

### Appendix B: Analysis Models
#### Data Flow Diagram
(TBD: Insert data flow diagram illustrating the flow of information within the system.)

### Appendix C: To Be Determined List
#### TBD Items
1. Performance metrics for specific functionalities.
2. Detailed security protocols and encryption algorithms.
3. Business rules for handling user data and interactions.
