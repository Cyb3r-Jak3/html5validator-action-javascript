variable "NODE_VERSION" {
  default = "12"
}

target "node-version" {
  args = {
    NODE_VERSION = NODE_VERSION
  }
}

group "default" {
  targets = ["test"]
}

target "test" {
  inherits = ["node-version"]
  dockerfile = "./testData/test.Dockerfile"
  target = "test-coverage"
  output = ["./coverage"]
}
